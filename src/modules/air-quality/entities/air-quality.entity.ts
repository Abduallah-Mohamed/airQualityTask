import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class AirQuality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aqi: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;
}
