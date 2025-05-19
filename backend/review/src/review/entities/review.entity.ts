import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Review')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'grading_id' })
    gradingId: number;

    @Column({ name: 'quiz_set_id' })
    quizSetId: number;

    @Column({ name: 'quiz_id' })
    quizId: number;

    @Column({ type: 'timestamp', name: 'to_review' })
    toReview: Date;
}
