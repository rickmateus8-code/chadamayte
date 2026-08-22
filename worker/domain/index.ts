// Domain layer for mayte-baby-shower
export interface Guest {
  id: string;
  name: string;
  phone?: string;
  confirmed: boolean;
  plusOnesCount: number;
}
