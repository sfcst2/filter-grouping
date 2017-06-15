/**
 * This represents a node on the graph.  This can be a 
 * filter group (and, or, not) or an actual filter
 */
export class FilterNodeModel{
    id:number;
    value: string;
    parentId:number;
}