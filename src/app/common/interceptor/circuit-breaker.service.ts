import { Injectable } from '@angular/core';

export interface CircuitState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  nextTry: number;
}

@Injectable({
  providedIn: 'root',
})
export class CircuitBreakerService {
  private readonly failureThreshold = 3;
  private readonly cooldownMs = 15000;
  private circuits = new Map<string, CircuitState>();

  canRequest(key: string): boolean {
    const circuit = this.circuits.get(key);
    
    if (!circuit) {
      this.initializeCircuit(key);
      return true;
    }

    if (circuit.state === 'OPEN') {
      if (Date.now() >= circuit.nextTry) {
        circuit.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }

    return true;
  }

  onSuccess(key: string): void {
    const circuit = this.circuits.get(key);
    if (circuit) {
      circuit.failureCount = 0;
      circuit.state = 'CLOSED';
    }
  }

  onFailure(key: string): void {
    const circuit = this.circuits.get(key);
    if (circuit) {
      circuit.failureCount++;
      if (circuit.failureCount >= this.failureThreshold) {
        circuit.state = 'OPEN';
        circuit.nextTry = Date.now() + this.cooldownMs;
      }
    }
  }

  private initializeCircuit(key: string): void {
    this.circuits.set(key, {
      state: 'CLOSED',
      failureCount: 0,
      nextTry: 0,
    });
  }
}
