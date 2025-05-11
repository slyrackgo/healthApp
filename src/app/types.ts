// export interface Goal {
//         id: string;
//         name: string;
//         targetDate: Date | null | undefined; // Allow null
//         description: string;
//         completed: boolean;
//     }

// export interface TrainingPlan {
//     id: string;
//     name: string;
//     description: string;
//     startDate: Date | undefined;
//     endDate: Date | undefined;
//     exercises: Exercise[];
// }

// export interface Exercise {
//     id: string;
//     name: string;
//     sets: number;
//     reps: number;
//     weight: number; // in kg
// }

// export interface ProgressEntry {
//     id: string;
//     date: Date;
//     weight: number; // in kg
//     notes: string;
// }
export interface Goal {
    id: string;
    name: string;
    targetDate: Date | undefined;
    description: string;
    completed: boolean;
}

export interface TrainingPlan {
    id: string;
    name: string;
    description: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    exercises: Exercise[];
}

export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number; // in kg
}

export interface ProgressEntry {
    id: string;
    date: Date;
    weight: number; // in kg
    notes: string;
}