import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    gradingId: number;

    @Column()
    quizSetId: number;

    @Column()
    quizId: number;

    @Column({ type: 'timestamp' })
    toReview: Date;
}
