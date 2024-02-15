import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-home-routed',
  templateUrl: './home-routed.component.html',
  styleUrls: ['./home-routed.component.scss']
})
export class HomeRoutedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    initFlowbite();

  }

}
