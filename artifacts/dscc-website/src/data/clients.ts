export interface Client {
  id: string;
  name: string;
  type: "client" | "partner";
}

export const clients: Client[] = [
  { id: "1", name: "Saudi Aramco", type: "client" },
  { id: "2", name: "NEOM", type: "client" },
  { id: "3", name: "Red Sea Global", type: "client" },
  { id: "4", name: "Diriyah Gate", type: "client" },
  { id: "5", name: "Qiddiya", type: "client" },
  { id: "6", name: "ROSHN", type: "client" },
  { id: "7", name: "Marriott International", type: "client" },
  { id: "8", name: "Hilton", type: "client" },
  { id: "9", name: "IHG Hotels", type: "client" },
  { id: "10", name: "Accor", type: "client" },
  { id: "11", name: "Rotana Hotels", type: "client" },
  { id: "12", name: "Mövenpick", type: "client" },
  { id: "13", name: "Schneider Electric", type: "partner" },
  { id: "14", name: "Daikin", type: "partner" },
  { id: "15", name: "Mitsubishi Electric", type: "partner" },
  { id: "16", name: "Honeywell", type: "partner" },
  { id: "17", name: "Siemens", type: "partner" },
  { id: "18", name: "Crestron", type: "partner" },
  { id: "19", name: "Lutron", type: "partner" },
  { id: "20", name: "Cisco", type: "partner" },
  { id: "21", name: "Hansgrohe", type: "partner" },
  { id: "22", name: "Duravit", type: "partner" },
  { id: "23", name: "Technogym", type: "partner" },
  { id: "24", name: "Rational", type: "partner" },
];
