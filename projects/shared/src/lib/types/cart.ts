import { Model } from "./models";

export interface CartItem {
	id: string;
	wig: Model.Wig;
	length: Model.Wig.Length;
	quantity: number;
	added_at: string;
}
