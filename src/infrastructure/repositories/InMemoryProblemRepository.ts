import { Problem } from '../../domain/entities/Problem';
import { ProblemRepository } from '../../domain/repositories/ProblemRepository';

export class InMemoryProblemRepository implements ProblemRepository {
  private problems: Map<string, Problem> = new Map();

  constructor() {
    // Seed data
    const p1 = Problem.create(
      'elevator-system',
      'Elevator System',
      'Design an Elevator System for a multi-story building. It should handle multiple elevators, dispatch them efficiently, and manage internal/external requests.',
      ['Handle multiple elevators', 'Optimize for minimum wait time', 'Thread safe'],
      ['Composition over Inheritance', 'State Pattern for Elevator State'],
      ['Strategy pattern for dispatching algorithms', 'Proper encapsulation of Elevator state']
    );
    this.problems.set(p1.id, p1);
    
    const p2 = Problem.create(
      'parking-lot',
      'Parking Lot',
      'Design a Parking Lot system that can hold motorcycles, cars and buses. The parking lot has multiple levels.',
      ['Multiple vehicle types', 'Multiple levels', 'Ticket tracking'],
      ['Composition over Inheritance'],
      ['Strategy pattern for pricing algorithm', 'Factory pattern for Ticket generation']
    );
    this.problems.set(p2.id, p2);

    const p3 = Problem.create(
      'library-system',
      'Library Management System',
      'Design a Library Management System where patrons can borrow books, reserve items, and librarians can manage inventory. Handle overdue fines.',
      ['Track book availability', 'Manage user accounts and limits', 'Calculate overdue fines'],
      ['Single Responsibility Principle', 'State Pattern for Book Status'],
      ['Observer pattern for reservation notifications', 'Clear separation of entities (Book vs BookItem)']
    );
    this.problems.set(p3.id, p3);

    const p5 = Problem.create(
      'vending-machine',
      'Vending Machine',
      'Design a Vending Machine that accepts multiple types of coins, tracks inventory, and dispenses items. Handle states like NoCoin, HasCoin, Dispensing.',
      ['Track coin balance', 'Manage item inventory', 'Calculate change'],
      ['State Pattern for Vending Machine states'],
      ['Factory pattern for Item generation']
    );
    this.problems.set(p5.id, p5);

    const p6 = Problem.create(
      'snake-and-ladder',
      'Snake and Ladder',
      'Design a multiplayer Snake and Ladder game. The board size can be customized, and snakes/ladders can be placed anywhere.',
      ['Handle multiple players and turns', 'Dice roll logic', 'Check for winning player'],
      ['Single Responsibility Principle'],
      ['Strategy pattern for Dice rolling (normal, loaded, etc)']
    );
    this.problems.set(p6.id, p6);

    const p7 = Problem.create(
      'splitwise',
      'Splitwise App',
      'Design an expense sharing app like Splitwise. Users can add expenses, split them equally or exactly, and view their balances.',
      ['Track user balances', 'Support multiple split types (Equal, Exact, Percent)', 'Simplify debts'],
      ['Strategy Pattern for Split calculations'],
      ['Factory pattern for Expense generation']
    );
    this.problems.set(p7.id, p7);
  }

  public async save(problem: Problem): Promise<void> {
    this.problems.set(problem.id, problem);
  }

  public async findById(id: string): Promise<Problem | null> {
    return this.problems.get(id) || null;
  }

  public async findAll(): Promise<Problem[]> {
    return Array.from(this.problems.values());
  }
}
