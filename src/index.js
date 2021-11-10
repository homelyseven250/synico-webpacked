import { io } from 'socket.io-client';
import { Collapse, Dropdown } from 'bootstrap';

// import 'bootstrap/dist/css/bootstrap.min.css
import './main.scss';

export const socket = io();
console.log("This site was made by many awesome people, one of whom wrote this message!");
