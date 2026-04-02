<?php

namespace App\EventListener;

use App\Entity\User;
use App\Repository\GenerationRepository;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Twig\Environment;
use DateTime;

#[AsEventListener(event: 'kernel.controller')]
class TwigGlobalListener
{
    public function __construct(
        private Environment $twig,
        private TokenStorageInterface $tokenStorage,
        private GenerationRepository $generationRepository,
    ) {
    }

    public function onKernelController(ControllerEvent $event): void
    {
        $token = $this->tokenStorage->getToken();
        $user = $token?->getUser();

        if (!$user instanceof User) {
            $this->twig->addGlobal('headerUser', null);
            return;
        }

        $roles = $user->getRoles();
        $planName = 'FREE';
        $conversionsLimit = 5;

        if (in_array('ROLE_PREMIUM', $roles)) {
            $planName = 'PREMIUM';
            $conversionsLimit = -1;
        } elseif (in_array('ROLE_BASIC', $roles)) {
            $planName = 'BASIC';
            $conversionsLimit = 50;
        }

        $resetTime = $this->calculateResetTime($user);

        $this->twig->addGlobal('headerUser', [
            'firstname'        => $user->getFirstname(),
            'lastname'         => $user->getLastname(),
            'email'            => $user->getEmail(),
            'planName'         => $planName,
            'conversionsLimit' => $conversionsLimit,
            'conversionsUsed'  => $this->generationRepository->countTodayByUser($user),
            'resetTime'        => $resetTime,
        ]);
    }

    private function calculateResetTime(User $user): string
    {
        $now = new DateTime();
        $lastGeneration = $this->generationRepository->findLastByUser($user);

        if (!$lastGeneration) {
            return '0h 0m';
        }

        $resetAt = (clone $lastGeneration->getCreatedAt())->modify('+24 hours');

        if ($resetAt <= $now) {
            return '0h 0m';
        }

        $diff = $now->diff($resetAt);
        return $diff->h . 'h ' . $diff->i . 'm';
    }
}
