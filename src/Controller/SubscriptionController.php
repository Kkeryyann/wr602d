<?php

namespace App\Controller;

use App\Entity\Plan;
use App\Entity\User;
use App\Repository\PlanRepository;
use App\Repository\ToolRepository;
use App\Services\StripeService; // Attention au "s" de Services selon ton namespace
use App\Security\Voter\PlanSelectVoter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\SecurityBundle\Security;

final class SubscriptionController extends AbstractController
{
    #[Route('/subscription', name: 'app_abonnement')]
    public function index(PlanRepository $planRepository, ToolRepository $toolRepository): Response
    {
        $plans = $planRepository->findBy(['active' => true], ['price' => 'ASC']);
        $allTools = $toolRepository->findBy(['isActive' => true]);

        $toolsByPlanId = [];
        foreach ($allTools as $tool) {
            foreach ($tool->getPlans() as $plan) {
                $toolsByPlanId[$plan->getId()][] = [
                    'name' => $tool->getName(),
                    'slug' => $tool->getSlug(),
                    'icon' => $tool->getIcon(),
                ];
            }
        }

        $plansData = array_map(function ($plan) use ($toolsByPlanId) {
            return [
                'id' => $plan->getId(),
                'name' => $plan->getName(),
                'description' => $plan->getDescription(),
                'price' => $plan->getPrice(),
                'specialPrice' => $plan->getSpecialPrice(),
                'limitGeneration' => $plan->getLimitGeneration(),
                'stripePriceId' => $plan->getStripePriceId(),
                'tools' => $toolsByPlanId[$plan->getId()] ?? [],
            ];
        }, $plans);

        $toolsData = array_map(function ($t) {
            $minPlan = null;
            foreach ($t->getPlans() as $plan) {
                if ($minPlan === null || $plan->getPrice() < $minPlan->getPrice()) {
                    $minPlan = $plan;
                }
            }
            return [
                'id'          => $t->getId(),
                'name'        => $t->getName(),
                'icon'        => $t->getIcon(),
                'description' => $t->getDescription(),
                'slug'        => $t->getSlug(),
                'minPlan'     => $minPlan ? ['name' => $minPlan->getName(), 'price' => $minPlan->getPrice()] : null,
            ];
        }, $allTools);

        /** @var User|null $user */
        $user = $this->getUser();
        $currentPlanId = $user?->getPlan()?->getId();

        return $this->render('subscription/index.html.twig', [
            'plans' => $plansData,
            'tools' => $toolsData,
            'currentPlanId' => $currentPlanId,
        ]);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/subscription/select-plan/{id}', name: 'app_abonnement_select_plan', methods: ['POST'])]
    public function selectPlan(Plan $plan, EntityManagerInterface $entityManager, Security $security): JsonResponse
    {
        $this->denyAccessUnlessGranted(PlanSelectVoter::SELECT, $plan);

        /** @var User $user */
        $user = $this->getUser();

        // 1. SI PLAN GRATUIT
        if ($plan->getPrice() == 0) {
            $user->setPlan($plan);
            $planRole = $plan->getRole();
            $user->setRoles($planRole ? [$planRole] : []);
            
            $entityManager->flush();
            $security->login($user, 'form_login', 'main');

            return $this->json([
                'success' => true,
                'message' => 'Plan gratuit sélectionné avec succès !',
                'planName' => $plan->getName(),
                'redirectUrl' => null // Pas de paiement requis
            ]);
        }

        // 2. SI PLAN PAYANT
        $checkoutUrl = $this->generateUrl('app_abonnement_checkout', ['id' => $plan->getId()]);

        return $this->json([
            'success' => true,
            'message' => 'Redirection vers le paiement en cours...',
            'planName' => $plan->getName(),
            'redirectUrl' => $checkoutUrl
        ]);
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/subscription/checkout/{id}', name: 'app_abonnement_checkout', methods: ['GET'])]
    public function checkout(Plan $plan, StripeService $stripeService): Response
    {
        /** @var User $user */
        $user = $this->getUser();

        // URLs de retour après paiement
        $successUrl = $this->generateUrl('app_abonnement_success', [], UrlGeneratorInterface::ABSOLUTE_URL);
        $cancelUrl  = $this->generateUrl('app_abonnement_cancel', [], UrlGeneratorInterface::ABSOLUTE_URL);

        // Appel propre à ton service Stripe avec les 4 arguments attendus !
        $checkoutUrl = $stripeService->createCheckoutSession(
            $user,
            $plan,
            $successUrl,
            $cancelUrl
        );

        return $this->redirect($checkoutUrl);
    }

    #[Route('/subscription/success', name: 'app_abonnement_success')]
    public function success(): Response
    {
        return $this->render('subscription/success.html.twig');
    }

    #[Route('/subscription/cancel', name: 'app_abonnement_cancel')]
    public function cancel(): Response
    {
        return $this->render('subscription/cancel.html.twig');
    }
}
