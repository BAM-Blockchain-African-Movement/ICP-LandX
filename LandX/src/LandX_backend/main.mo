import Nat "mo:base/Nat";


actor Counter {
  stable var count : Nat = 0;

  public func increment() : async Nat {
    count += 1;
    return count;
  };

  public func decrement() : async Nat {
    if (count > 0) {
      count -= 1;
    };
    return count;
  };

  public query func get() : async Nat {
    return count;
  };
}