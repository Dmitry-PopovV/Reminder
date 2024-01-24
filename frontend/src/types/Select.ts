export type Select = {
	view: "noSelection"
	date: null
	eventID: null
} | {
	view: "day"
	date: string
	eventID: null
} | {
	view: "redactor"
	date: string
	eventID: null | string
	isNew: boolean
}
