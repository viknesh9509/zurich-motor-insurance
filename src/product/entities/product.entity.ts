import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    
  })
  productCode: string;

  @Column()
  productDescription: string;

  @Column()
  location: string;

  @Column('decimal')
  price: number;
}
