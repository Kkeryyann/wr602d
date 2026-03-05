<?php

namespace App\Controller;

use App\Service\GotenbergService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints\File;

class GeneratePdfController extends AbstractController
{
    public function __construct(
        private GotenbergService $pdfService,
    ) {
    }

    #[Route('/generate', name: 'app_generate_pdf', methods: ['GET', 'POST'])]
    public function generatePdf(Request $request): Response
    {
        $form = $this->createFormBuilder()
            ->add('url', null, ['required' => true, 'label' => 'URL'])
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            $pdfContent = $this->pdfService->generatePdfFromUrl($data['url']);

            return new Response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="generated.pdf"',
            ]);
        }

        return $this->render('pdf/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/html-to-pdf', name: 'app_html_to_pdf', methods: ['GET', 'POST'])]
    public function htmlToPdf(Request $request): Response
    {
        $form = $this->createFormBuilder()
            ->add('htmlFile', FileType::class, [
                'required' => true,
                'label' => 'Fichier HTML',
                'constraints' => [
                    new File(['mimeTypes' => ['text/html'], 'mimeTypesMessage' => 'Veuillez envoyer un fichier HTML valide.']),
                ],
            ])
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            $htmlContent = $data['htmlFile']->getContent();
            $pdfContent = $this->pdfService->generatePdfFromHtml($htmlContent);

            return new Response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="generated.pdf"',
            ]);
        }

        return $this->render('pdf/html_to_pdf.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
