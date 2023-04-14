use std::io;

// std::mem::drop
// fn drop<T>(_x: T) {}

// fn hello() -> String {
//   String::from("hello")
// }

// fn world(s: &mut String) {
//   s.push_str(", world!");
// }

// fn main() {
//   let mut s = hello();
//   world(&mut s);
//   println!("{}", s);
// }

// fn first_word(s: &String) -> String {
//   s.split(" ").collect::<Vec<&str>>()[0].to_string()
// }

// fn first_word(s: &String) -> String {
//   let bytes = s.as_bytes();

//   let l = {
//     let mut l = s.len();

//     for (i, &item) in bytes.iter().enumerate() {
//       if item == b' ' {
//         l = i;
//         break;
//       }
//     }

//     l
//   };

//   s[0..l].to_string()
// }

// fn first_word(s: &str) -> &str {
//   let bytes = s.as_bytes();

//   let mut t = &s[..];

//   for (i, &item) in bytes.iter().enumerate() {
//     if item == b' ' {
//       t = &s[0..i]
//     }
//   }

//   t
// }

// fn first_word(s: &str) -> &str {
//   let bytes = s.as_bytes();

//   for (i, &item) in bytes.iter().enumerate() {
//     if item == b' ' {
//       return &s[0..i];
//     }
//   }

//   &s[..]
// }

// fn first_word(s: &str) -> &str {
//   s.split(" ")
//     .next()
//     .expect("the split string iterator has a next item")
// }

fn word(s: &str, n: usize) -> Option<&str> {
  s.split(" ").skip(n).next()
}

fn main() {
  let mut words = String::new();
  println!("Input some words.");
  io::stdin()
    .read_line(&mut words)
    .expect("Failed to read line");

  loop {
    let mut n = String::new();
    println!("Enter the number of the word to be printed back (starting from 0).");
    io::stdin().read_line(&mut n).expect("Failed to read line");

    let n = match n.trim().parse::<usize>() {
      Ok(num) => num,
      Err(_) => {
        println!("Please enter a number >= 0.");
        continue;
      }
    };

    match word(&words, n) {
      None => {
        println!("there isn't a word number {}.", n);
        continue;
      }
      Some(w) => {
        println!("Word number {} is:", n);
        println!("{}", w);
        break;
      }
    }
  }
}
