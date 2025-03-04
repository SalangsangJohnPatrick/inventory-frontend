export interface InventoryItem {
    id: number;
    brand_name: string;
    type: string;
    quantity_on_hand: number;
    price: number;
    inventory_value: number;
    products_sold: number;
    sales_value: number;
}