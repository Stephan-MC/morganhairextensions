import type { Model } from "./models";

export interface CartItem extends Model.Wig {
	id: string;
	quantity: number;
	added_at: string;
}
