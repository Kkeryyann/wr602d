import { Application } from '@hotwired/stimulus';
import { registerReactControllerComponents } from '@symfony/ux-react';
import ReactController from '@symfony/ux-react/dist/render_controller.js';
import './styles/app.css';

const app = Application.start();
app.register('symfony--ux-react--react', ReactController);

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/));
