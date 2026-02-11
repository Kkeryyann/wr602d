<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\UrlType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Url;
use Symfony\Component\Validator\Constraints\Range;

class PdfConversionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('url', UrlType::class, [
                'label' => 'URL à convertir',
                'attr' => [
                    'placeholder' => 'https://www.example.com',
                    'class' => 'form-control',
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer une URL',
                    ]),
                    new Url([
                        'message' => 'Veuillez entrer une URL valide',
                    ]),
                ],
            ])

            ->add('submit', SubmitType::class, [
                'label' => 'Générer le PDF',
                'attr' => [
                    'class' => 'btn btn-primary',
                ],
            ]);
    }

}
