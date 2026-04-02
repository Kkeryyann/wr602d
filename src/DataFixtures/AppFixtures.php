<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use App\Entity\Plan;
use App\Entity\Tool;
use Doctrine\Persistence\ObjectManager;
use DateTimeImmutable;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $plans = $this->loadPlans($manager);

        $this->loadTools($manager, $plans['free'], $plans['basic'], $plans['premium']);

        $manager->flush();
    }

    /**
     * @return array<string, Plan>
     */
    private function loadPlans(ObjectManager $manager): array
    {
        $planFree = $this->createPlan(
            'FREE',
            'Abonnement gratuit - 5 générations par mois',
            0,
            5,
            'ROLE_USER'
        );
        $manager->persist($planFree);

        $planBasic = $this->createPlan(
            'BASIC',
            'Abonnement basic - 50 générations par mois',
            9.95,
            50,
            'ROLE_BASIC'
        );
        $manager->persist($planBasic);

        $planPremium = $this->createPlan(
            'PREMIUM',
            'Abonnement PREMIUM - générations illimitées',
            44.95,
            -1,
            'ROLE_PREMIUM'
        );
        $manager->persist($planPremium);

        return [
            'free' => $planFree,
            'basic' => $planBasic,
            'premium' => $planPremium,
        ];
    }

    private function loadTools(ObjectManager $manager, Plan $free, Plan $basic, Plan $premium): void
    {
        $this->createTool(
            $manager,
            'URL vers PDF',
            'Convertissez n\'importe page web en PDF depuis son URL',
            'blue',
            'Link',
            'url',
            [$free, $basic, $premium]
        );
        $this->createTool(
            $manager,
            'HTML vers PDF',
            "Convertissez un HTML en PDF fidèle au rendu navigateur",
            'orange',
            'Code',
            'html',
            [$basic, $premium]
        );
        $this->createTool(
            $manager,
            'Word vers PDF',
            'Convertissez vos fichiers Word (.doc, .docx) en PDF',
            'blue',
            'FileText',
            'word',
            [$basic, $premium]
        );
        $this->createTool(
            $manager,
            'Excel vers PDF',
            'Convertissez vos fichiers Excel (.xls, .xlsx) en PDF',
            'green',
            'Sheet',
            'excel',
            [$basic, $premium]
        );
        $this->createTool(
            $manager,
            'PowerPoint vers PDF',
            'Convertissez vos présentations (.ppt, .pptx) en PDF',
            'red',
            'Presentation',
            'powerpoint',
            [$basic, $premium]
        );

        $this->loadPremiumTools($manager, $basic, $premium);
    }

    private function loadPremiumTools(ObjectManager $manager, Plan $basic, Plan $premium): void
    {
        $this->createTool(
            $manager,
            'Image vers PDF',
            'Convertissez vos images (.jpg, .png, .tiff…) en PDF',
            'purple',
            'Image',
            'image',
            [$basic, $premium]
        );
        $this->createTool(
            $manager,
            'Fusionner des PDFs',
            'Combinez plusieurs fichiers PDF en un seul document',
            'indigo',
            'Combine',
            'merge',
            [$premium]
        );
        $this->createTool(
            $manager,
            'Découper un PDF',
            'Extrayez des pages ou des intervalles d\'un PDF',
            'yellow',
            'Scissors',
            'split',
            [$premium]
        );
        $this->createTool(
            $manager,
            'Convertir en PDF/A',
            "Archivez vos documents en format PDF/A-1b, PDF/A-2b ou PDF/A-3b",
            'teal',
            'Archive',
            'pdfa',
            [$premium]
        );
        $this->createTool(
            $manager,
            'Protéger un PDF',
            "Chiffrez votre PDF avec un mot de passe utilisateur et/ou propriétaire",
            'rose',
            'LockKeyhole',
            'encrypt',
            [$premium]
        );
    }

    private function createPlan(string $name, string $description, float $price, int $limit, string $role): Plan
    {
        $plan = new Plan();
        $plan->setName($name);
        $plan->setDescription($description);
        $plan->setPrice($price);
        $plan->setLimitGeneration($limit);
        $plan->setRole($role);
        $plan->setActive(true);
        $plan->setCreatedAt(new DateTimeImmutable());
        return $plan;
    }

    /**
     * @param Plan[] $plans
     */
    private function createTool(
        ObjectManager $manager,
        string $name,
        string $description,
        string $color,
        string $icon,
        string $slug,
        array $plans
    ): void {
        $tool = new Tool();
        $tool->setName($name);
        $tool->setDescription($description);
        $tool->setColor($color);
        $tool->setIcon($icon);
        $tool->setSlug($slug);
        $tool->setIsActive(true);
        foreach ($plans as $plan) {
            $tool->addPlan($plan);
        }
        $manager->persist($tool);
    }
}
