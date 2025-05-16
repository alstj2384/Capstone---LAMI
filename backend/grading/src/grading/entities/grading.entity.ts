import { Submission } from 'src/submissions/entities/submission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Grading {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quizSetId: number;

    @Column()
    userId: number;

    @Column()
    score: number;

    @Column({ type: 'timestamp' })
    submissionDate: Date;

    @OneToMany(() => Submission, (submission) => submission.grading)
    submissions: Submission[];
}
