<?php


namespace App\Services;


use App\Entity\Plan;
use App\Entity\User;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Stripe\Webhook;


class StripeService
{
    public function __construct(
        private string $secretKey,
        private string $webhookSecret,
    ) {
        Stripe::setApiKey($this->secretKey);
    }


    /**
     * Crée une Checkout Session Stripe pour l'abonnement à un plan.
     * Retourne l'URL vers laquelle rediriger l'utilisateur.
     */
    public function createCheckoutSession(
        User $user,
        Plan $plan,
        string $successUrl,
        string $cancelUrl,
    ): string {
        $session = Session::create([
            'mode' => 'subscription',
            'customer_email' => $user->getEmail(),
            'line_items' => [[
                'price' => $plan->getStripePriceId(),
                'quantity' => 1,
            ]],
            'success_url' => $successUrl . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $cancelUrl,
            // On stocke l'ID utilisateur pour le retrouver dans le webhook
            'metadata' => [
                'user_id' => $user->getId(),
                'plan_id' => $plan->getId(),
            ],
            'subscription_data' => [
                'metadata' => [
                    'user_id' => $user->getId(),
                    'plan_id' => $plan->getId(),
                ],
            ],
        ]);


        return $session->url;
    }


    /**
     * Vérifie la signature du webhook Stripe et retourne l'événement.
     * Lève une exception si la signature est invalide.
     */
    public function constructWebhookEvent(string $payload, string $sigHeader): \Stripe\Event
    {
        return Webhook::constructEvent($payload, $sigHeader, $this->webhookSecret);
    }
}
