export interface Model {
	id: string;
	created_at: string;
	updated_at: string;
}

export namespace Model {
	export interface Media extends Model {
		filename: string;
		extension: string;
		variant_name: string | null;
		mime_type: string;
		aggregate_type: string;
		url: string;
		size: number;
		original_media_id: string | null;
		alt: string;
		variants: Array<Omit<Media, "variants">>;
	}

	export enum DiscountType {
		PERCENTAGE = "percentage",
		FIXED = "fixed",
	}

	export interface Discount extends Model {
		id: string;
		name: string;
		type: DiscountType;
		value: number;
		is_active: boolean;
		reccurent: boolean;
		start_date: string;
		end_date: string;
	}

	export interface Review extends Model {
		// client: Client;
		comment: Comment;
		// rating: Reaction;
		// reactions: Array<Reaction>;
	}

	export namespace Wig {
		export interface Color extends Model {
			name: string;
			code: string;
		}

		export interface Length extends Model {
			value: number;
			price: number;
			stock: number;
			default: boolean;
		}
		export interface Source extends Model {
			name: string;
		}
		export interface Texture extends Model {
			name: string;
		}
		export interface Lace extends Model {
			name: string;
		}
		export interface HairType extends Model {
			name: string;
			slug: string;
			thumbnail: Media;
		}
		export interface Parting extends Model {
			name: string;
		}
		export interface Cap extends Model {
			size: number;
		}
	}

	export interface Wig extends Model {
		name: string;
		slug: string;
		description: string;
		featured: string;
		stock: number;

		discount: Discount;
		liked: boolean;
		length: Wig.Length & { price: number; default: boolean };
		thumbnail: Media;
		gallery: Array<Media>;

		lengths: Array<Wig.Length & { price: number; default: boolean }>;
		reviews: Array<Review>;
		rating: {
			/** The total number of clients who rated the product */
			count: number;

			/** The total number of stars awarded by all clients who rated */
			weight: number;
		} & Omit<Model, "id">;
		love: {
			/** The total number of clients who rated the product */
			count: number;

			/** The total number of stars awarded by all clients who rated */
			weight: number;
		} & Omit<Model, "id">;
		discounts: Array<Discount>;
		hair_type: Wig.HairType;
		color: Wig.Color;
		lace: Wig.Lace;
		source: Wig.Source;
		texture: Wig.Texture;
		parting: Wig.Parting;
		cap: Wig.Cap;
	}

	export interface WigFilter {
		/** The query string. used to filter wigs by name */
		q?: string;

		/** The Color code, name or id used to filter wigs */
		color?: Wig.Color["name"] | Wig.Color["id"] | Wig.Color["code"];

		hair_type?: Wig.HairType["name"] | Wig.HairType["id"];

		lace?: Wig.Lace["name"] | Wig.Lace["id"];

		length?: Wig.Length["id"] | Wig.Length["value"];

		source?: Wig.Source["name"] | Wig.Source["id"];

		texture?: Wig.Texture["name"] | Wig.Texture["id"];

		parting?: Wig.Parting["name"];

		cap?: Wig.Cap["size"];

		page?: number;

		/** Indicates whether only the featured products should be selected or not */
		featured?: boolean;
	}
}
