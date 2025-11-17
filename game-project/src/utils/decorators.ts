// Decorators for game functionality

export function log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.log(`🎮 [${target.constructor.name}] ${propertyName}(${args.map(a => JSON.stringify(a)).join(', ')})`);
    const result = method.apply(this, args);
    if (result !== undefined) {
      console.log(`   → ${JSON.stringify(result)}`);
    }
    return result;
  };
}

export function validate(validationFn: (args: any[]) => boolean, errorMessage: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      if (!validationFn(args)) {
        throw new Error(`Validation failed for ${propertyName}: ${errorMessage}`);
      }
      return method.apply(this, args);
    };
  };
}

export function cooldown(seconds: number) {
  const cooldowns = new Map<string, number>();
  
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      const key = `${target.constructor.name}.${propertyName}`;
      const now = Date.now();
      const lastUsed = cooldowns.get(key) || 0;
      
      if (now - lastUsed < seconds * 1000) {
        const remaining = Math.ceil((seconds * 1000 - (now - lastUsed)) / 1000);
        throw new Error(`${propertyName} is on cooldown for ${remaining} more seconds`);
      }
      
      cooldowns.set(key, now);
      return method.apply(this, args);
    };
  };
}

export function memoize(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  const cache = new Map<string, any>();
  
  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log(`📋 Cache hit for ${propertyName}`);
      return cache.get(key);
    }
    
    const result = method.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
