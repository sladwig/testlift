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

(I got the jsessionid by making an request to the server and then reading out the cookie. I also made more than 100.000 requests before the test.)

$ ab -c 10 -n 10000 -C JSESSIONID=n8ehmams4txp http://localhost:8080/
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
Document Length:        651 bytes

Concurrency Level:      10
Time taken for tests:   5.435 seconds
Complete requests:      10000
Failed requests:        0
Write errors:           0
Total transferred:      9400000 bytes
HTML transferred:       6510000 bytes
Requests per second:    1839.76 [#/sec] (mean)
Time per request:       5.435 [ms] (mean)
Time per request:       0.544 [ms] (mean, across all concurrent requests)
Transfer rate:          1688.84 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       2
Processing:     1    5  15.4      2     295
Waiting:        0    5  15.1      2     295
Total:          1    5  15.4      3     295

Percentage of the requests served within a certain time (ms)
  50%      3
  66%      4
  75%      5
  80%      5
  90%      7
  95%      8
  98%     52
  99%     53
 100%    295 (longest request)





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
Time taken for tests:   17.235 seconds
Complete requests:      10000
Failed requests:        0
Write errors:           0
Total transferred:      9173690 bytes
HTML transferred:       6562624 bytes
Requests per second:    580.21 [#/sec] (mean)
Time per request:       17.235 [ms] (mean)
Time per request:       1.724 [ms] (mean, across all concurrent requests)
Transfer rate:          519.79 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       1
Processing:     2   17  12.7     13      69
Waiting:        1   17  12.7     13      69
Total:          2   17  12.7     13      69

Percentage of the requests served within a certain time (ms)
  50%     13
  66%     13
  75%     13
  80%     14
  90%     24
  95%     56
  98%     57
  99%     57
 100%     69 (longest request)




Result
======
Requests per second:
Lift:  1839
Rails:  580

That’s a plus of ~317%