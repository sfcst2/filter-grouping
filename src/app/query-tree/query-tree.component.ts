import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Vis from 'vis';
import { Dialog } from 'primeng/primeng';
import { AddFilterComponent } from './add-filter/add-filter.component';
import {AddFilterModel} from '../models/add-filter.model';

declare var vis;

@Component({
  selector: 'query-tree',
  templateUrl: './query-tree.component.html',
  styleUrls: ['./query-tree.component.css']
})
export class QueryTreeComponent implements OnInit {  

  @ViewChild('myNetwork')
  myNetwork: ElementRef;

  private showAddFilterDialog;boolean;

  private addFilter:AddFilterModel;

  // This is the nodes object that backs the vis js graph
  private nodes:vis.DataSet;  

  // This is the edges object that backs the vis js graph
  private edges:vis.DataSet;

  // Reference to the network graph
  private network:any;  

  constructor() { }

  ngOnInit() {

    this.populateGraphData();

    // create a network
    var container = this.myNetwork.nativeElement;
    this.network = new vis.Network(container, {  nodes: this.nodes, edges: this.edges }, this.getGraphOptions());

    var scope = this;
    // Add a click listener for when we click on the nodes
    this.network.on("click", function (params) {            
      console.log('click event, getNodeAt returns: ' + this.getNodeAt(params.pointer.DOM));
      
      if(params && params.nodes && params.nodes.length > 0){
          // Get the id of the node we clicked on
          let id = params.nodes[0];          

          if(id === 1){            
            scope.addFilterNode(scope.getNextId(scope));
          }        
      }
    });
  }

  getNextId(scope:any) :number{    
    
    let max:number = 0;

    // Go through all of the data and find the greatest number. We then want to increment it by one
    for(let node of scope.nodes){
       if(parseInt(node.id) > max){
         max = node.id
       }
    }

    return max ++;
  }

  /**
   * Function that we will get into when we add a filter via the add-filter component
   */
  filterAdded(addFilterNode:AddFilterModel):void{    
    this.nodes.add({
       id: addFilterNode.id,
       label: addFilterNode.value
    });
    this.showAddFilterDialog = false;
  }

  /**
   * Function that is called when we click on the add filter node in the graph
   */
  addFilterNode(nodeId:number): void{   
    // Create a new AddFilterModel and show the add filter dialog 
    this.addFilter = new AddFilterModel();
    this.addFilter.id = nodeId;
    this.showAddFilterDialog = true;
  }

  populateGraphData(): void {
    // create an array with nodes
    let nodesArray = [{
      id: 0,
      label: 'And (Root)'
    }, {
      id: 1,
      label: 'Add Filter',
      shape: 'icon',
      icon: {
        face: 'FontAwesome',
        code: '\uf067',
        size: 25,
        color: 'green'
      }
    },
    {
      id: 2,
      label: 'Add Grouping',
      shape: 'icon',
      icon: {
        face: 'FontAwesome',
        code: '\uf067',
        size: 25,
        color: 'green'
      }
    },
    {
      id: 3,
      label: 'Add Grouping',
      shape: 'icon',
      group: 'remove'
    }];

    this.nodes = new vis.DataSet(nodesArray);

    // create an array with edges
    let edgesArray = [{
      from: 0,
      to: 1
    }, {
      from: 0,
      to: 2
    }];

    this.edges = new vis.DataSet(edgesArray);
  }


  getGraphOptions(): any {
    /**
     * With our graph options we use the font awsome icons and create
     * a group for removing. This will allow to place an icon next to the
     * button
     */
    return {
      groups: {
        remove: {
          shape: 'icon',
          icon: {
            face: 'FontAwesome',
            code: '\uf00d',
            size: 25,
            color: 'red'
          }
        }
      }
    };
  }

}
