export interface ApiResponse {
  status: string;
  message: string;
  data: any; 
  token?: string; // Puedes especificar el tipo de 'data' más detalladamente si lo deseas
}
