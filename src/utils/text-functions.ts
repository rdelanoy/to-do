import { TasksMap } from "@/types/types";

/**
 *  Normaliza el texto:
 * - Quita espacios extras
 * - Convierte a minúsculas
 * - Elimina acentos
 */
const normalizeText = (text: string): string => {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

/**
 * Busca si un título ya existe en el mapa de tareas.
 * Retorna un objeto con el resultado y la ID de la tarea encontrada (si existe).
 */
export const findTaskByTitle = (
  title: string,
  map: TasksMap
): { exists: boolean; taskId?: string } => {
  const normalizedTitle = normalizeText(title);

  for (const [key, task] of Object.entries(map)) {
    if (normalizeText(task.title) === normalizedTitle) {
      return { exists: true, taskId: key };
    }
  }

  return { exists: false };
};
