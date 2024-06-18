import { Injectable, OnDestroy } from '@angular/core';
import { differenceInMinutes } from 'date-fns';
import { BehaviorSubject, interval } from 'rxjs';

type CacheData = {
  time: Date,
  data: any
}

@Injectable({
  providedIn: 'root'
})
export class CacheService implements OnDestroy {
  // A HashMap to store the cache. The key is the page and the value is the data.
  private cache = new Map<string, CacheData>();

  private timer$ = interval(30000).subscribe(()=>{
    this.checkCacheTimeout();
  })

  // BehaviorSubject that will contain the updated cache data.
  public cache$ = new BehaviorSubject<{key: string; data: any} | null>(null);

  ngOnDestroy(): void {
    this.timer$.unsubscribe()
  }

  // The 'set' method for storing data in the cache.
  set(key: string, data: any): void {
    // We check if data already exists for this key.
    if (this.cache.has(key)) {
      // If it already exists, we throw an exception to prevent overwriting the data.
      throw new Error(`Data already exists for key '${key}'. Use a different key or delete the existing one first.`);
    }
    // If there is no data for this key, we store it in the cache and update the BehaviorSubject.
    const cacheData: CacheData = {
      time: new Date(),
      data
    }
    this.cache.set(key, cacheData);
    this.cache$.next({key, data});
  }

  // The 'get' method for retrieving data from the cache.
  get(key: string): any {
    // We retrieve the data from the cache and update the BehaviorSubject.

    const cacheData = this.cache.get(key);
    if (!cacheData || differenceInMinutes(new Date(), cacheData.time) > 14) {
      this.clear(key);
      return null;
    }

    return cacheData?.data;
  }

  // The 'clear' method to clear data from the cache.
  clear(key: string): void {
    // We remove the data from the cache and update the BehaviorSubject.
    this.cache.delete(key);
    this.cache$.next(null);
  }

  checkCacheTimeout() {
    this.cache.forEach((cacheData, key) => {
      if (differenceInMinutes(new Date(), cacheData.time) > 14) {
        this.clear(key);
      }
    })
  }

  emit(key: string) {
    if (this.get(key) === undefined) {
      this.cache$.next(null);
    }
    else {
      this.cache$.next({key, data: this.get(key)});
    }
  }


}