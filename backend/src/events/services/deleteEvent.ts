import { Event } from "../../entity/Event";

export async function deleteEvent(id: string, email: string) {
    const event = await Event.findOneOrFail({
        where: { id: id },
        relations: { user: true }
    });

    if (event.user.email !== email) {
        throw new Error("Attempt to delete another's event");
    }

    await event.remove();
}
