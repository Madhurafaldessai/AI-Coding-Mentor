-- Seed metadata. Client APIs must never select solutions or test_cases.
begin;
insert into public.skill_nodes (id, language, position, title, description, is_boss) values
 ('python-output','python',1,'Hello World & Output','Make your first program speak.',false),
 ('python-math','python',2,'Variables & Math','Store values and work with numbers.',false),
 ('python-conditionals','python',3,'Conditionals','Let your program make decisions.',false),
 ('python-loops','python',4,'Loops & Strings','Repeat work and shape text.',false),
 ('python-boss','python',5,'Boss: Mini Project','Put your new skills together.',true),
 ('javascript-output','javascript',1,'Hello World & Output','Make your first program speak.',false),
 ('javascript-math','javascript',2,'Variables & Math','Store values and work with numbers.',false),
 ('javascript-conditionals','javascript',3,'Conditionals','Let your program make decisions.',false),
 ('javascript-loops','javascript',4,'Loops & Strings','Repeat work and shape text.',false),
 ('javascript-boss','javascript',5,'Boss: Mini Project','Put your new skills together.',true),
 ('cpp-output','cpp',1,'Hello World & Output','Make your first program speak.',false),
 ('cpp-math','cpp',2,'Variables & Math','Store values and work with numbers.',false),
 ('cpp-conditionals','cpp',3,'Conditionals','Let your program make decisions.',false),
 ('cpp-loops','cpp',4,'Loops & Strings','Repeat work and shape text.',false),
 ('cpp-boss','cpp',5,'Boss: Mini Project','Put your new skills together.',true)
on conflict (id) do update set title=excluded.title, description=excluded.description, is_boss=excluded.is_boss;

-- Existing challenge ids are preserved: sum-two-numbers, even-or-odd, reverse-string.
insert into public.challenges (id, title, difficulty, category, concepts, base_xp, order_index, node_id) values
 ('print-greeting','Print a Greeting','easy','Hello World & Output',array['output'],50,1,'python-output'),
 ('echo-name','Echo a Name','easy','Hello World & Output',array['input','output'],50,2,'python-output'),
 ('sum-two-numbers','Sum of Two Numbers','easy','Variables & Math',array['variables','math'],50,1,'python-math'),
 ('max-of-two','Larger Number','easy','Variables & Math',array['variables','math'],50,2,'python-math'),
 ('even-or-odd','Even or Odd','easy','Conditionals',array['conditionals'],50,1,'python-conditionals'),
 ('grade-label','Grade Label','medium','Conditionals',array['conditionals'],80,2,'python-conditionals'),
 ('reverse-string','Reverse a String','easy','Loops & Strings',array['strings','loops'],50,1,'python-loops'),
 ('count-vowels','Count Vowels','medium','Loops & Strings',array['strings','loops'],80,2,'python-loops'),
 ('fizzbuzz','FizzBuzz','medium','Boss: Mini Project',array['loops','conditionals'],80,1,'python-boss'),
 ('mini-calculator','Mini Calculator','hard','Boss: Mini Project',array['conditionals','math'],120,2,'python-boss')
on conflict (id) do update set title=excluded.title, difficulty=excluded.difficulty, concepts=excluded.concepts,
 base_xp=excluded.base_xp, order_index=excluded.order_index;

-- The seven new challenges receive server-only tests and reference solutions.
update public.challenges set
 test_cases='[{"input":"","expected":"Hello, World!"},{"input":"ignored","expected":"Hello, World!"}]'::jsonb,
 solutions=jsonb_build_object('python',$$print("Hello, World!")$$,'javascript',$$console.log("Hello, World!");$$,'cpp',$$#include <iostream>\nint main(){std::cout<<"Hello, World!\\n";}$$)
 where id='print-greeting';
update public.challenges set
 test_cases='[{"input":"Ada","expected":"Ada"},{"input":"Grace Hopper","expected":"Grace Hopper"},{"input":"x","expected":"x"},{"input":"Code Town","expected":"Code Town"}]'::jsonb,
 solutions=jsonb_build_object('python',$$import sys; print(sys.stdin.read().strip())$$,'javascript',$$console.log(require('fs').readFileSync(0,'utf8').trim());$$,'cpp',$$#include <iostream>\n#include <string>\nint main(){std::string s;std::getline(std::cin,s);std::cout<<s<<'\\n';}$$)
 where id='echo-name';
update public.challenges set
 test_cases='[{"input":"3 5","expected":"5"},{"input":"-2 -7","expected":"-2"},{"input":"0 0","expected":"0"},{"input":"9 1","expected":"9"}]'::jsonb,
 solutions=jsonb_build_object('python',$$import sys; a,b=map(int,sys.stdin.read().split()); print(max(a,b))$$,'javascript',$$const x=require('fs').readFileSync(0,'utf8').trim().split(/\s+/).map(Number);console.log(Math.max(x[0],x[1]));$$,'cpp',$$#include <iostream>\n#include <algorithm>\nint main(){long long a,b;std::cin>>a>>b;std::cout<<std::max(a,b)<<'\\n';}$$)
 where id='max-of-two';
update public.challenges set
 test_cases='[{"input":"95","expected":"A"},{"input":"81","expected":"B"},{"input":"70","expected":"C"},{"input":"59","expected":"F"}]'::jsonb,
 solutions=jsonb_build_object('python',$$import sys; n=int(sys.stdin.read()); print('A' if n>=90 else 'B' if n>=80 else 'C' if n>=70 else 'F')$$,'javascript',$$const n=+require('fs').readFileSync(0,'utf8');console.log(n>=90?'A':n>=80?'B':n>=70?'C':'F');$$,'cpp',$$#include <iostream>\nint main(){int n;std::cin>>n;std::cout<<(n>=90?"A":n>=80?"B":n>=70?"C":"F")<<'\\n';}$$)
 where id='grade-label';
update public.challenges set
 test_cases='[{"input":"hello","expected":"2"},{"input":"AEIOU","expected":"5"},{"input":"rhythm","expected":"0"},{"input":"Code Town","expected":"3"}]'::jsonb,
 solutions=jsonb_build_object('python',$$import sys; print(sum(c.lower() in 'aeiou' for c in sys.stdin.read().strip()))$$,'javascript',$$const s=require('fs').readFileSync(0,'utf8').trim().toLowerCase();console.log([...s].filter(c=>'aeiou'.includes(c)).length);$$,'cpp',$$#include <iostream>\n#include <string>\nint main(){std::string s;std::getline(std::cin,s);int n=0;for(char c:s){c=tolower(c);if(std::string("aeiou").find(c)!=std::string::npos)n++;}std::cout<<n<<'\\n';}$$)
 where id='count-vowels';
update public.challenges set
 test_cases='[{"input":"3","expected":"Fizz"},{"input":"5","expected":"Buzz"},{"input":"15","expected":"FizzBuzz"},{"input":"7","expected":"7"}]'::jsonb,
 solutions=jsonb_build_object('python',$$import sys; n=int(sys.stdin.read()); print('FizzBuzz' if n%15==0 else 'Fizz' if n%3==0 else 'Buzz' if n%5==0 else n)$$,'javascript',$$const n=+require('fs').readFileSync(0,'utf8');console.log(n%15===0?'FizzBuzz':n%3===0?'Fizz':n%5===0?'Buzz':n);$$,'cpp',$$#include <iostream>\n#include <string>\nint main(){int n;std::cin>>n;std::cout<<(n%15==0?"FizzBuzz":n%3==0?"Fizz":n%5==0?"Buzz":std::to_string(n))<<'\\n';}$$)
 where id='fizzbuzz';
update public.challenges set
 test_cases='[{"input":"3 + 5","expected":"8"},{"input":"9 - 14","expected":"-5"},{"input":"6 * 7","expected":"42"},{"input":"20 / 4","expected":"5"}]'::jsonb,
 solutions=jsonb_build_object('python',$$import sys; a,o,b=sys.stdin.read().split(); a=int(a);b=int(b);print(a+b if o=='+' else a-b if o=='-' else a*b if o=='*' else a//b)$$,'javascript',$$const [a,o,b]=require('fs').readFileSync(0,'utf8').trim().split(/\s+/);const x=+a,y=+b;console.log(o==='+'?x+y:o==='-'?x-y:o==='*'?x*y:Math.trunc(x/y));$$,'cpp',$$#include <iostream>\nint main(){long long a,b;char o;std::cin>>a>>o>>b;std::cout<<(o=='+'?a+b:o=='-'?a-b:o=='*'?a*b:a/b)<<'\\n';}$$)
 where id='mini-calculator';

-- Dollar-quoted C++ seeds encode line breaks visibly; store actual line breaks in the JSON value.
update public.challenges
set solutions = jsonb_set(solutions, '{cpp}', to_jsonb(replace(solutions->>'cpp', E'\\n', chr(10))))
where id in ('print-greeting','echo-name','max-of-two','grade-label','count-vowels','fizzbuzz','mini-calculator');

insert into public.skill_node_challenges (node_id, challenge_id, position)
select language || '-' || node_key, challenge_id, position
from (values
 ('output','print-greeting',1),('output','echo-name',2),
 ('math','sum-two-numbers',1),('math','max-of-two',2),
 ('conditionals','even-or-odd',1),('conditionals','grade-label',2),
 ('loops','reverse-string',1),('loops','count-vowels',2),
 ('boss','fizzbuzz',1),('boss','mini-calculator',2)
) as challenge_map(node_key, challenge_id, position)
cross join (values ('python'),('javascript'),('cpp')) as tracks(language)
on conflict (node_id, challenge_id) do update set position=excluded.position;

insert into public.badges (id, name, description, icon) values
 ('first_solve','First build','Complete your first challenge.','spark'),
 ('no_hints_needed','Clear thinking','Finish a challenge without hints.','lightbulb'),
 ('three_day_streak','Three-day streak','Learn three days in a row.','flame'),
 ('seven_day_streak','Seven-day streak','Learn seven days in a row.','trophy'),
 ('node_complete','Neighbourhood complete','Complete every challenge in a town stop.','home'),
 ('polyglot','Polyglot','Complete a challenge in all three languages.','languages')
on conflict (id) do update set name=excluded.name, description=excluded.description, icon=excluded.icon;
commit;
