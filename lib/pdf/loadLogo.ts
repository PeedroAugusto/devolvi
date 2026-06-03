const LOGO_PATH = "/logo.png";

export async function loadLogoDataUrl(): Promise<string> {
  const response = await fetch(LOGO_PATH);
  if (!response.ok) {
    throw new Error("Não foi possível carregar a logo.");
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Falha ao processar a logo."));
    reader.readAsDataURL(blob);
  });
}

export { LOGO_PATH };
