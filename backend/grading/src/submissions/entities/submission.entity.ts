import { Grading } from 'src/grading/entities/grading.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('QuizGrading')
export class Submission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'quiz_id' })
    quizId: number;

    @Column({ name: 'submitted_answer' })
    submittedAnswer: string;

    @Column({ name: 'is_correct' })
    isCorrect: boolean;

    @Column({ nullable: true, default: null })
    feedback: string;

    @Column({ nullable: true, default: null })
    memorization: string;

    @ManyToOne(() => Grading, (grading) => grading.submissions, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'grading_id' })
    grading: Grading;
}
