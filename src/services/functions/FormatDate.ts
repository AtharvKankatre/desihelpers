export function formatDate(date: string | undefined) {
  try {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date!));
    return formattedDate;
  } catch (error) {
    return "-";
  }
}
