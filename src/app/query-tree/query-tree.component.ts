import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataSet, Node, Edge, Network, Data, Options } from 'vis';
import { Dropdown, SelectItem } from 'primeng/primeng';
import { FilterNodeModel } from '../models/filter-node.model';

@Component({
    selector: 'query-tree',
    templateUrl: './query-tree.component.html',
    styleUrls: ['./query-tree.component.css']
})
export class QueryTreeComponent implements OnInit {

    @ViewChild('myNetwork')
    myNetwork: ElementRef;

    @ViewChild('graphNodes')
    graphNodesDropDown: Dropdown;

    @ViewChild('addFilterInputField')
    addFilterInputField: ElementRef;

    @ViewChild('addFilterGroupCombo')
    addFilterGroupCombo: Dropdown;

    private filterGroupOptions: SelectItem[] = [
        {
            label: 'AND',
            value: 'AND'
        },
        {
            label: 'OR',
            value: 'OR'
        },
        {
            label: 'NOT',
            value: 'NOT'
        }
    ];

    private showAddFilterDialog; boolean;

    private showAddFilterGroupDialog: boolean;

    // This is the nodes object that backs the vis js graph
    private nodes: DataSet<Node>;

    // This is the edges object that backs the vis js graph
    private edges: DataSet<Edge>;

    // Reference to the network graph
    private network: Network;

    private graphNode: SelectItem[] = [];

    private selectedGraphNodeLabel: string;

    private currentMaxNodeId: number = 0;

    readonly ROOT_NODE_LABEL: string = 'And (Root)';

    readonly ROOT_NODE_VALUE: number = 0;

    readonly NODE_GROUP: string = 'nodeGroup';

    constructor() { }

    ngOnInit() {

        this.populateGraphData();

        // create a network
        let container = this.myNetwork.nativeElement;
        let data: Data = {
            edges: this.edges,
            nodes: this.nodes
        };
        this.network = new Network(container, data, this.getGraphOptions());

        let scope = this;
        // Add a click listener for when we click on the nodes
        this.network.on('click', function (params) {

            if (params && params.nodes && params.nodes.length > 0) {
                // Get the id of the node we clicked on
                let id = params.nodes[0];
                scope.deleteFilter(id, scope);
            }
        });
    }

    graphNodesComboChanged(event: any): void {
        this.network.setSelection({
            nodes: [event.value],
            edges: []
        });
    }

    deleteFilter(id: number, scope: any) {

        // Don't delete the root
        if (id === this.ROOT_NODE_VALUE) {
            return;
        }

        // Get all of the nodes that are connected
        let connectedNodes: any[] = this.network.getConnectedNodes(id);

        this.network.setSelection({
            nodes: [id],
            edges: []
        });
        this.network.deleteSelected();

        // We want to recursively call this if we have any additonal nodes connected
        for (let connectedId of connectedNodes) {
            this.deleteFilter(connectedId, scope);
        }

        // We need to populate the drop down again
        this.populateGraphNodesCombo();
    }

    /**
     * Function that we will get into when we press the add button in the filterAdded
     * dialog
     */
    filterAdded(): void {
        this.currentMaxNodeId ++;

        // Create a new AddFilterModel
        let addFilterNode: FilterNodeModel = new FilterNodeModel();
        addFilterNode.id = this.currentMaxNodeId;
        addFilterNode.value = this.addFilterInputField.nativeElement.value;

        // Close the dialog and pull the value from the combobox where we added
        // the filter to
        this.showAddFilterDialog = false;
        addFilterNode.parentId = this.getNodeIdFromDropDown();

        this.nodes.add({
            id: addFilterNode.id,
            label: addFilterNode.value,
            group: this.NODE_GROUP
        });

        this.edges.add({
            from: addFilterNode.parentId,
            to: addFilterNode.id
        });

        // We need to repopulate the graph nodes since we added a new filter
        this.populateGraphNodesCombo();
    }
    

    /**
     * Function that we will get into when we press the add button in the filter group
     * dialog     
     */
    filterGroupAdded(): void {

        this.currentMaxNodeId ++;

        // Create a new AddFilterModel 
        let addFilterNode: FilterNodeModel = new FilterNodeModel();
        addFilterNode.id = this.currentMaxNodeId;
        addFilterNode.value = this.addFilterGroupCombo.selectedOption.value

        // Close the dialog and pull the value from the combobox where we added
        // the filter to
        this.showAddFilterGroupDialog = false;
        addFilterNode.parentId = this.getNodeIdFromDropDown();

        this.nodes.add({
            id: addFilterNode.id,
            label: addFilterNode.value,
            group: this.NODE_GROUP
        });

        this.edges.add({
            from: addFilterNode.parentId,
            to: addFilterNode.id
        });

        // We need to repopulate the graph nodes since we added a new filter
        this.populateGraphNodesCombo();
    }


    /**
     * Function that is called when we click on the add filter node in the graph
     */
    addFilterMenuOptionClicked(): void {
        this.showAddFilterDialog = true;
    }

    /**
     * Function that is called when we click on the add filter grouping node in the graph
     */
    addFilterGroupNodeClicked(): void {
        this.showAddFilterGroupDialog = true;
    }

    /**
     * return the value of the selected field in the drop down
     */
    getNodeIdFromDropDown(): number {
        return parseInt(this.graphNodesDropDown.selectedOption.value);
    }

    populateGraphData(): void {
        // create an array with nodes
        let nodesArray: Node[] = [{
            id: 0,
            label: this.ROOT_NODE_LABEL,
            shape: 'icon',
            group: 'root'
        }
        ];

        this.nodes = new DataSet<Node>(nodesArray);

        // Populate the graph node ids
        this.populateGraphNodesCombo();

        // set the selectedGraphNodeLabel to the root node
        this.selectedGraphNodeLabel = this.ROOT_NODE_LABEL;

        // create an array with edges
        let edgesArray = [];
        this.edges = new DataSet(edgesArray);
    }

    /**
     * Populates all of the graph node ids
     */
    populateGraphNodesCombo(): void {
        this.graphNode = [];
        if (this.nodes) {
            this.nodes.forEach((item: Node, id:string) =>{

                this.graphNode.push({
                    label: item.label,
                    value: item.id
                });

            });            
        }
    }


    getGraphOptions(): Options {
        /**
         * With our graph options we use the font awsome icons and create
         * a group for removing. This will allow to place an icon next to the
         * button
         */
        return {
            groups: {
                nodeGroup: {
                    shape: 'icon',
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf00d',
                        size: 25,
                        color: 'red'
                    },
                },
                root: {
                    shape: 'icon',
                    icon: {
                        face: 'FontAwesome',
                        code: '\uf005',
                        size: 25,
                        color: 'yellow'
                    }
                }
            },
            layout: {
                hierarchical: {
                    direction: 'LR'
                }
            }
        };
    }

}
