export interface JobData {
    id: string;
    name: string;
    entries: string[];
    firedEntry: string;
    minAmount: number;
};

const jobs: JobData[] = [{
    id: "developer",
    name: "Developer",
    entries: ["{user.username} devloped a program for a client and got paid **₡{money}**."],
    firedEntry: "{user.username} got fired for missing to many deadlines.",
    minAmount: 500
}, {
    id: "chemist",
    name: "High School Chemistry Teacher",
    entries: [],
    firedEntry: "{user.username} got fired for mussing to many days from school.",
    minAmount: 300
}, {
    id: "designer",
    name: "Designer",
    entries: ["{user.usernmae} designed a house for *₡{money}**."],
    firedEntry: "{user.username} missed a deadline and go fired.",
    minAmount: 350
}, {
    id: "gamedeveloper",
    name: "Game Developer",
    entries: ["{user.username} worked on a game and earned **₡{money}**."],
    firedEntry: "{user.username} got fired for missing deadlines for a game.",
    minAmount: 500
}, {
    id: "constructionworker",
    name: "Construction Worker",
    entries: ["{user.username} built a shed for **₡{money}.**",
        "{user.username} helped a team of construction workers and earned **₡{money}**."],
    firedEntry: "{user.username} didn't finish building a house and got fired.",
    minAmount: 4000
}, {
    id: "chief",
    name: "Chief",
    entries: ["{user.username} cooked a meal today for **₡{money}**.",
        "{user.username} got tipped **₡{money}** for cooking up a good meal."],
    firedEntry: "{user.username} didn't come to the kitchen got fired.",
    minAmount: 200
}, {
    id: "mechanic",
    name: "Mechanic",
    entries: ["{user.username} fixed a car for **₡{money}**.", 
        "{user.username} got paid **₡{money}** for fixing a car."],
    firedEntry: "{user.username} did fix a car in time and got fired.",
    minAmount: 150
}, {
    id: "youtuber",
    name: "Youtuber",
    entries: ["After publishing a video {user.username} got paid **₡{money}** from ad revenue.", 
        "{user.username} earned **₡{money}** from merch sales."],
    firedEntry: "{user.username} didn't publish a video in a long time and their channel died.",
    minAmount: 100
}, {
    id: "artist",
    name: "Artist",
    entries: [""],
    firedEntry: "{user.username} failed to complete a painting in time and lost the job.",
    minAmount: 100
}, {
    id: "driver",
    name: "Driver",
    entries: [],
    firedEntry: "{user.username} didn't come to work and failed to deliver important things. They got fired.",
    minAmount: 200
}, {
    id: "dentist",
    name: "Dentist",
    entries: [],
    firedEntry: "{user.username} failed to attend patients and got fired.",
    minAmount: 500
}, {
    id: "doctor",
    name: "Doctor",
    entries: [],
    firedEntry: "{user.username} didn't attend patients in time and got fired.",
    minAmount: 600
}, {
    id: "nurse",
    name: "Nurse",
    entries: [],
    firedEntry: "{user.username} didn't take care of patients and got fired.",
    minAmount: 450
}, {
    id: "accountant",
    name: "Accountant",
    entries: [],
    firedEntry: "{user.username} didn't submit important documents in time and got fired.",
    minAmount: 350
}, {
    id: "lawyer",
    name: "Lawyer",
    entries: [],
    firedEntry: "{user.username} didn't attend a tial and got fired.",
    minAmount: 450
}];

export default jobs;