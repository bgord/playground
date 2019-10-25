import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:scoped_model/scoped_model.dart';
import 'package:http/http.dart' as http;

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class CounterModel extends Model {
  int _counter = 0;

  int get counter => _counter;

  void increment() {
    _counter++;
    notifyListeners();
  }

  void decrement() {
    if (_counter != 0) {
      _counter--;
    }
    notifyListeners();
  }

  void boost(int step) {
    _counter = _counter + step;
    notifyListeners();
  }
}

class GithubUser {
  final String login;
  final String createdAt;
  final String avatarUrl;

  GithubUser({this.login, this.createdAt, this.avatarUrl});
}

class GithubUserModel extends Model {
  GithubUser _user;

  GithubUser get user => _user;

  void fetchUser(String query) async {
    http.Response response =
        await http.get("http://api.github.com/users/${query}");
    final body = jsonDecode(response.body);

    var login = body["login"];
    var createdAt = body["created_at"];
    var avatarUrl = body["avatar_url"];

    var user = new GithubUser(
      login: login,
      createdAt: createdAt,
      avatarUrl: avatarUrl,
    );

    _user = user;
    notifyListeners();
  }
}

class CounterButtons extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new ScopedModelDescendant<CounterModel>(
        builder: (context, child, model) {
      return Column(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 15.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                RaisedButton(
                  child: Text("Increment"),
                  onPressed: () {
                    model.increment();
                  },
                ),
                RaisedButton(
                  child: Text("Decrement"),
                  onPressed: () {
                    model.decrement();
                  },
                ),
                RaisedButton(
                  child: Text("Boost"),
                  onPressed: () {
                    model.boost(3);
                  },
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 20.0),
            child: Text("Avatar chars to show: ${model.counter}"),
          )
        ],
      );
    });
  }
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(widget.title),
        ),
        body: Column(
          children: <Widget>[
            new ScopedModel<CounterModel>(
              model: new CounterModel(),
              child: Column(
                children: <Widget>[
                  CounterButtons(),
                  ScopedModel<GithubUserModel>(
                    model: new GithubUserModel(),
                    child: Column(
                      children: <Widget>[
                        ScopedModelDescendant<GithubUserModel>(
                          builder: (context, child, model) {
                            final counter = ScopedModel.of<CounterModel>(
                                    context,
                                    rebuildOnChange: true)
                                .counter;
                            final user = ScopedModel.of<GithubUserModel>(
                                    context,
                                    rebuildOnChange: true)
                                .user;
                            return Column(
                              children: <Widget>[
                                Padding(
                                  padding: const EdgeInsets.all(15.0),
                                  child: RaisedButton(
                                    child: Text('Find me'),
                                    onPressed: () {
                                      model.fetchUser(("bgord"));
                                    },
                                  ),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: <Widget>[
                                    Padding(
                                      padding: const EdgeInsets.only(top: 20.0),
                                      child: model.user == null
                                          ? null
                                          : Column(
                                              children: <Widget>[
                                                Text(model.user.login),
                                                Text(model.user.createdAt),
                                                Text(
                                                  model.user.avatarUrl
                                                      .substring(
                                                          0,
                                                          counter >=
                                                                  model
                                                                      .user
                                                                      .avatarUrl
                                                                      .length
                                                              ? model
                                                                  .user
                                                                  .avatarUrl
                                                                  .length
                                                              : counter),
                                                ),
                                              ],
                                            ),
                                    ),
                                  ],
                                )
                              ],
                            );
                          },
                        ),
                      ],
                    ),
                  )
                ],
              ),
            )
          ],
        ));
  }
}
