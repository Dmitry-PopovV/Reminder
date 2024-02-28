import { Events } from "../../entity/Events";

export async function deleteEvent(id: string, email: string) {
    const event = await Events.findOneOrFail({
        where: { id: id },
        relations: { email: true }
    });

    if (event.email.email !== email) {
        throw new Error("Attempt to delete another's event");
    }

    await event.remove();
}