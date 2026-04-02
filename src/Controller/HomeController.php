<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\PlanRepository;
use App\Repository\ToolRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(PlanRepository $planRepository, ToolRepository $toolRepository): Response
    {
        $plans = $planRepository->findBy(['active' => true], ['price' => 'ASC']);
        $tools = $toolRepository->findBy(['isActive' => true]);

        $toolsByPlanId = [];
        foreach ($tools as $tool) {
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
                'image' => $plan->getImage(),
                'tools' => $toolsByPlanId[$plan->getId()] ?? [],
            ];
        }, $plans);

        $toolsData = array_map(function ($tool) {
            $minPlan = null;
            foreach ($tool->getPlans() as $plan) {
                if ($minPlan === null || $plan->getPrice() < $minPlan->getPrice()) {
                    $minPlan = $plan;
                }
            }

            return [
                'id' => $tool->getId(),
                'name' => $tool->getName(),
                'icon' => $tool->getIcon(),
                'description' => $tool->getDescription(),
                'color' => $tool->getColor(),
                'slug' => $tool->getSlug(),
                'minPlan' => $minPlan ? ['name' => $minPlan->getName(), 'price' => $minPlan->getPrice()] : null,
            ];
        }, $tools);

        /** @var User|null $currentUser */
        $currentUser = $this->getUser();

        $currentPlanId = null;
        if ($currentUser !== null && $currentUser->getPlan() !== null) {
            $currentPlanId = $currentUser->getPlan()->getId();
        }

        return $this->render('home/index.html.twig', [
            'plans' => $plansData,
            'currentPlanId' => $currentPlanId,
            'tools' => $toolsData,
        ]);
    }
}
