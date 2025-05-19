import { Submission } from 'src/submissions/entities/submission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Grading')
export class Grading {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'quiz_set_id' })
    quizSetId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    score: number;

    @Column({ type: 'timestamp', name: 'submission_date' })
    submissionDate: Date;

    @OneToMany(() => Submission, (submission) => submission.grading)
    submissions: Submission[];
}
