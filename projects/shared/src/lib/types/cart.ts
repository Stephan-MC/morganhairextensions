import type { Model } from "./models";

export interface CartItem extends Model.Wig {
	id: string;
	length: Model.Wig.Length;
	quantity: number;
	added_at: string;
}
