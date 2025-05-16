import { Grading } from 'src/grading/entities/grading.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quizId: number;

    @Column()
    submittedAnswer: string;

    @Column()
    isCorrect: boolean;

    @Column({ nullable: true, default: null })
    feedback: string;

    @Column({ nullable: true, default: null })
    memorization: string;

    @ManyToOne(() => Grading, (grading) => grading.submissions, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'gradingId' })
    grading: Grading;
}
