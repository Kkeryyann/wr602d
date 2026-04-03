<?php

namespace App\Controller;

use App\Repository\PlanRepository;
use App\Repository\UserRepository;
use App\Services\StripeService;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Exception\SignatureVerificationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Stripe\Event;

class WebhookController extends AbstractController
{
    #[Route('/payment/webhook', name: 'app_payment_webhook', methods: ['POST'])]
    public function webhook(
        Request $request,
        StripeService $stripeService,
        UserRepository $userRepository,
        PlanRepository $planRepository,
        EntityManagerInterface $em,
    ): Response {
        $payload = $request->getContent();
        $sigHeader = $request->headers->get('Stripe-Signature');

        if (!$sigHeader) {
            return new Response('Signature manquante', Response::HTTP_BAD_REQUEST);
        }

        try {
            $event = $stripeService->constructWebhookEvent($payload, $sigHeader);
        } catch (SignatureVerificationException $e) {
            return new Response('Signature invalide', Response::HTTP_BAD_REQUEST);
        }

        return $this->handleEvent($event, $userRepository, $planRepository, $em);
    }

    private function handleEvent(
        Event $event,
        UserRepository $userRepository,
        PlanRepository $planRepository,
        EntityManagerInterface $em
    ): Response {
        if ($event->type === 'checkout.session.completed') {
            return $this->handleCheckoutCompleted($event->data->object, $userRepository, $planRepository, $em);
        }

        if ($event->type === 'customer.subscription.deleted') {
            return $this->handleSubscriptionDeleted($event->data->object, $userRepository, $planRepository, $em);
        }

        return new Response('OK', Response::HTTP_OK);
    }

    private function handleCheckoutCompleted(
        object $session,
        UserRepository $userRepository,
        PlanRepository $planRepository,
        EntityManagerInterface $em
    ): Response {
        $userId = $session->metadata->user_id ?? null;
        $planId = $session->metadata->plan_id ?? null;

        if (!$userId || !$planId) {
            return new Response('Métadonnées manquantes', Response::HTTP_BAD_REQUEST);
        }

        $user = $userRepository->find($userId);
        $plan = $planRepository->find($planId);

        if (!$user || !$plan) {
            return new Response('Utilisateur ou plan introuvable', Response::HTTP_NOT_FOUND);
        }

        $user->setPlan($plan);
        $planRole = $plan->getRole();
        $user->setRoles($planRole ? [$planRole] : []);
        $em->flush();
        return new Response('OK', Response::HTTP_OK);
    }

    private function handleSubscriptionDeleted(
        object $subscription,
        UserRepository $userRepository,
        PlanRepository $planRepository,
        EntityManagerInterface $em
    ): Response {
        $userId = $subscription->metadata->user_id ?? null;

        if (!$userId) {
            return new Response('OK', Response::HTTP_OK);
        }

        $user = $userRepository->find($userId);
        $freePlan = $planRepository->findOneBy(['name' => 'FREE']);

        if ($user && $freePlan) {
            $user->setPlan($freePlan);
            $user->setRoles([]);
            $em->flush();
        }
        return new Response('OK', Response::HTTP_OK);
    }
}
