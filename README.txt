About the test
==============
For testing I used two very basic "hello world"-like applications, trying to serve the same HTML, with a little layout handling on both sides. 
For Rails I chose Thin server which is more or less on par with Passenger+NginX stack I use in production (and I know Thin is beeing used in production enviroment). For Lift I took the Jetty server which came out of the box and I read Jetty is often being chosen over Tomcat for production.



After testing
=============
Lift is indeed faster (~93%) in a low number of requests <7000, but something happens between 7000 and 8000 requests which puts lift into trouble (Threadpool full?). 

Another finding is that the CPU usage of Lift was much higher, than the one of Rails, even in a low number of requests. (see CPU usage screenshots)



System specification 
====================
* Mac OsX 10.6.2
* 2,8 GHz Intel Core i7
* 8GB Ram 
* ruby 1.8.7 (came with Mac OsX) / scala 2.7.7

(I also tried another 2,53 GHz Core 2 Duo - 4 GB Ram Machine, looks pretty much the same, just takes longer)



Testing Lift
============
$ mvn jetty:run

$ ab -c 10 -n 10000 http://localhost:8080/
This is ApacheBench, Version 2.3 <$Revision: 655654 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        Jetty(6.1.22)
Server Hostname:        localhost
Server Port:            8080

Document Path:          /
Document Length:        684 bytes

Concurrency Level:      10
Time taken for tests:   28.543 seconds
Complete requests:      10000
Failed requests:        9866
   (Connect: 0, Receive: 0, Length: 9866, Exceptions: 0)
Write errors:           0
Total transferred:      10191438 bytes
HTML transferred:       6856071 bytes
Requests per second:    350.35 [#/sec] (mean)
Time per request:       28.543 [ms] (mean)
Time per request:       2.854 [ms] (mean, across all concurrent requests)
Transfer rate:          348.69 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.4      0       9
Processing:     2   28  74.1      6     360
Waiting:        1   27  73.2      6     360
Total:          2   28  74.1      6     361

Percentage of the requests served within a certain time (ms)
  50%      6
  66%      8
  75%     10
  80%     11
  90%     16
  95%    263
  98%    311
  99%    321
 100%    361 (longest request)



Testing Rails
=============

$ RAILS_ENV=production script/server thin

$ ab -c 10 -n 10000 http://0.0.0.0:3000/
This is ApacheBench, Version 2.3 <$Revision: 655654 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 0.0.0.0 (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        thin
Server Hostname:        0.0.0.0
Server Port:            3000

Document Path:          /
Document Length:        656 bytes

Concurrency Level:      10
Time taken for tests:   16.718 seconds
Complete requests:      10000
Failed requests:        0
Write errors:           0
Total transferred:      9171858 bytes
HTML transferred:       6561312 bytes
Requests per second:    598.17 [#/sec] (mean)
Time per request:       16.718 [ms] (mean)
Time per request:       1.672 [ms] (mean, across all concurrent requests)
Transfer rate:          535.77 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:     2   16  12.4     12      75
Waiting:        1   16  12.3     12      66
Total:          2   17  12.4     13      75

Percentage of the requests served within a certain time (ms)
  50%     13
  66%     13
  75%     13
  80%     13
  90%     25
  95%     54
  98%     55
  99%     56
 100%     75 (longest request)



The surprising stuff
====================
1. Requests per second:
Lift : 343.92 [#/sec] (mean)
Rails: 598.17 [#/sec] (mean)

That's ~73 % more Requests.


2. Percentage of the requests served within a certain time (ms)
Lift :  95%    269
Rails: 100%     75

