<?php

namespace App\Tests;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Entity\Plan;
use Doctrine\ORM\EntityManagerInterface;

class RegistrationControllerTest extends WebTestCase
{
    private KernelBrowser $client;
    private UserRepository $userRepository;

    protected function setUp(): void
    {
        $this->client = static::createClient();

        // Ensure we have a clean database
        $container = static::getContainer();

        /** @var EntityManagerInterface $em */
        $em = $container->get('doctrine')->getManager();
        $this->userRepository = $container->get(UserRepository::class);

        // Remove all users
        foreach ($this->userRepository->findAll() as $user) {
            $em->remove($user);
        }

        // Remove all plans
        $plans = $em->getRepository(Plan::class)->findAll();
        foreach ($plans as $plan) {
            $em->remove($plan);
        }
        $em->flush();

        // Create a test plan
        $plan = new Plan();
        $plan->setName('FREE');
        $plan->setDescription('Abonnement gratuit');
        $plan->setPrice(0);
        $plan->setLimitGeneration(5);
        $plan->setRole('ROLE_USER');
        $plan->setActive(true);
        $plan->setCreatedAt(new \DateTimeImmutable());
        $em->persist($plan);
        $em->flush();
    }

    public function testRegister(): void
    {
        $container = static::getContainer();
        /** @var EntityManagerInterface $em */
        $em = $container->get('doctrine')->getManager();
        $plan = $em->getRepository(Plan::class)->findOneBy(['name' => 'FREE']);

        // Register a new user
        $crawler = $this->client->request('GET', '/register');
        self::assertResponseIsSuccessful();
        self::assertPageTitleContains('Inscription');

        // Note: Because the form is rendered by React, traditional submitForm won't work
        // Instead, we simulate the POST request directly to the controller
        $this->client->request('POST', '/register', [
            'registration_form' => [
                'firstname' => 'John',
                'lastname' => 'Doe',
                'email' => 'me@example.com',
                'plainPassword' => 'password123',
                'agreeTerms' => '1',
                'plan' => $plan->getId(),
                '_token' => $crawler->filter('div[data-react-props]')->attr('data-react-props') ? json_decode($crawler->filter('div[data-react-props]')->attr('data-react-props'), true)['csrfToken'] : '',
            ]
        ]);

        // Ensure the response redirects after submitting the form, the user exists, and is not verified
        self::assertResponseRedirects('/login');
        self::assertCount(1, $this->userRepository->findAll());
        self::assertFalse(($user = $this->userRepository->findAll()[0])->isVerified());

        // Ensure the verification email was sent
        self::assertEmailCount(1);

        self::assertCount(1, $messages = $this->getMailerMessages());
        self::assertEmailAddressContains($messages[0], 'from', 'job-fael.babalola@etudiant.univ-reims.fr');
        self::assertEmailAddressContains($messages[0], 'to', 'me@example.com');
        self::assertEmailTextBodyContains($messages[0], 'This link will expire in 1 hour.');

        // Login the new user
        $this->client->followRedirect();
        $this->client->loginUser($user);

        // Get the verification link from the email
        /** @var TemplatedEmail $templatedEmail */
        $templatedEmail = $messages[0];
        $messageBody = $templatedEmail->getHtmlBody();
        self::assertIsString($messageBody);

        preg_match('#(http://localhost/verify/email.+)">#', $messageBody, $resetLink);

        // "Click" the link and see if the user is verified
        $this->client->request('GET', $resetLink[1]);
        $this->client->followRedirect();

        self::assertTrue(static::getContainer()->get(UserRepository::class)->findAll()[0]->isVerified());
    }
}
