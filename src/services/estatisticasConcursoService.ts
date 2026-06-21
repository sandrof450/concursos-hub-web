import { EstatisticasSchema } from "../schemas/concurso.schema";

import api from "./api";

const getEstatisticas = async () => { 
  const { data } = await api.get('/Concurso/Estatisticas');
  return EstatisticasSchema.parse(data); 
}

export { getEstatisticas };