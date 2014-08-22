// myTest.js
describe('uBucketApp profile page', function() {
    var ptor = protractor.getInstance();

    beforeEach(function() {
      browser.get('http://ubucketapp.web.engr.illinois.edu/#/tab/about');
    });

    it('should have valid post count', function() {
        ptor.sleep(1000);
        var postCount = element(by.binding('postnum'));
        expect(postCount.getText()).toEqual("10");
    });

    it('should have valid completed count', function() {
        ptor.sleep(1000);
        var completed = element(by.binding('completednum'));
        expect(completed.getText()).toEqual("6");
    });

    it('should have valid remaining count', function() {
        ptor.sleep(1000);
        var remaining = element(by.binding('togo'));
        expect(remaining.getText()).toEqual("4");
    });
});

describe('uBucketApp private list', function() {
    var ptor = protractor.getInstance();
    var taskList;
    // var taskTitles=[];

    beforeEach(function() {
      browser.get('http://ubucketapp.web.engr.illinois.edu/#/tab/private');
      ptor.sleep(1000);

      taskList = element.all(by.repeater('task in tasks'));
    });

    it('should check progress bar', function() {
        ptor.sleep(1000);
        var response = element(by.binding('progress(remaining())'));
        expect(response.getText()).toEqual("60%");
    });

    it('should count tasks', function() {
        expect(taskList.count()).toEqual(10);
    });

    it('should add a new task to private list only', function() {
        var composeButton = ptor.findElement(protractor.By.id('compose'));
        composeButton.click();
        
        var addTask = element(by.input('currentTaskTitle')).sendKeys('This is a test');
        var submitButton = ptor.findElement(protractor.By.id('submit'));
        submitButton.click();

        browser.get('http://ubucketapp.web.engr.illinois.edu/#/tab/private');
        ptor.sleep(1000);
        expect(taskList.count()).toEqual(11);
    });
    
});

describe('uBucketApp public list', function() {
    var ptor = protractor.getInstance();
    var taskList;

    beforeEach(function() {
      browser.get('http://web.engr.illinois.edu/~ubucketapp/#/tab/public');
      ptor.sleep(1000);

      taskList = element.all(by.repeater('note in notes'));
    });

    it('should count notes', function() {
        expect(taskList.count()).toEqual(8);
    });

    it('should add a new note', function() {
        var composeButton = ptor.findElement(protractor.By.id('compose'));
        composeButton.click();
        
        var addTask = element(by.input('currentTaskTitle')).sendKeys('This is a test');
        var submitButton = ptor.findElement(protractor.By.id('submit'));
        submitButton.click();

        browser.get('http://ubucketapp.web.engr.illinois.edu/#/tab/public');
        ptor.sleep(1000);
        expect(taskList.count()).toEqual(9);
    });
});

describe('uBucketApp public list comment pages', function() {
    var ptor = protractor.getInstance();
    var taskList;

    beforeEach(function() {
      browser.get('http://web.engr.illinois.edu/~ubucketapp/#/tab/public');
      ptor.sleep(1000);

      taskList = element.all(by.repeater('note in notes'));
    });

    it('should check comment page', function () {
        browser.get('http://web.engr.illinois.edu/~ubucketapp/#/tab/public/BgctRl3Nr5');
        ptor.sleep(1000);
        var response = element(by.repeater('comment in comments').row(0).column('title'));
        expect(response.getText()).toEqual("Climb a tree");

        var comment = element(by.repeater('child in children').row(0).column('title'));
        expect(comment.getText()).toEqual("Don't do this! I broke my face doing this.");
    });

    it('should check comment page 3', function () {
        browser.get('http://web.engr.illinois.edu/~ubucketapp/#/tab/public/F7tf34zBft');
        ptor.sleep(1000);
        var response = element(by.repeater('comment in comments').row(0).column('title'));
        expect(response.getText()).toEqual("Eat Fat Sandwich");

        var comment = element(by.repeater('child in children').row(0).column('title'));
        expect(comment.getText()).toEqual("woah I've never been there!");
        var comment2 = element(by.repeater('child in children').row(1).column('title'));
        expect(comment2.getText()).toEqual("Fat Illini OR GO HOME.");
    });

    it('should check comment page 4', function () {
        browser.get('http://web.engr.illinois.edu/~ubucketapp/#/tab/public/Ga15iixo5s');
        ptor.sleep(1000);
        var response = element(by.repeater('comment in comments').row(0).column('title'));
        expect(response.getText()).toEqual("Sleep more");

        var comment = element(by.repeater('child in children').row(0).column('title'));
        expect(comment.getText()).toEqual("This needs to happen to me!!!");
    });
});

describe('uBucketApp login page', function() {
    var ptor = protractor.getInstance();

    beforeEach(function() {
      browser.get('http://web.engr.illinois.edu/~ubucketapp/#/login');
    });

    it('should output invalid response', function() {
        var inputEmail = element(by.input('user.email')).sendKeys('Invalid Email');
        var inputPassword = element(by.input('user.password')).sendKeys('invalid');
        var submitButton = ptor.findElement(protractor.By.id('submit'));
        submitButton.click();

        ptor.sleep(1000);

        var response = element(by.binding('response'));
        expect(response.getText()).toEqual("Login failed! Try again...");
    });

    it('should go to register page', function() {
        var registerButton = ptor.findElement(protractor.By.id('register'));
        registerButton.click();

        ptor.sleep(1000);

        expect(ptor.getCurrentUrl()).toContain('/register');
    });

    it('should register a new user', function() {
        var registerButton = ptor.findElement(protractor.By.id('register'));
        registerButton.click();

        ptor.sleep(1000);

        var inputEmail = element(by.input('user.email')).sendKeys('c@c.com');
        var inputPassword = element(by.input('user.password')).sendKeys('c');
        var submitButton = ptor.findElement(protractor.By.id('submit'));
        submitButton.click();

        ptor.sleep(1000);

        browser.get('http://web.engr.illinois.edu/~ubucketapp/#/login');

        var inputEmail2 = element(by.input('user.email')).sendKeys('b@b.com');
        var inputPassword2 = element(by.input('user.password')).sendKeys('b');
        var submitButton2 = ptor.findElement(protractor.By.id('submit'));
        submitButton2.click();

        ptor.sleep(1000);

        expect(ptor.getCurrentUrl()).toContain('tab/public');
    });

    it('should output valid response', function() {
        var inputEmail = element(by.input('user.email')).sendKeys('a@a.com');
        var inputPassword = element(by.input('user.password')).sendKeys('a');
        var submitButton = ptor.findElement(protractor.By.id('submit'));
        submitButton.click();

        ptor.sleep(1000);

        expect(ptor.getCurrentUrl()).toContain('tab/public');
    });
});

describe('uBucketApp feedback page', function() {
    var ptor = protractor.getInstance();

    beforeEach(function() {
      browser.get('http://ubucketapp.web.engr.illinois.edu/#/feedback');
    });

    it('should submit valid feedback', function() {
        var inputFeedback = element(by.input('feedback')).sendKeys('Valid feedback!');
        var submitButton = ptor.findElement(protractor.By.id('submit'));
        
        submitButton.click();
        ptor.sleep(1000);
        submitButton.click();
        ptor.sleep(1000);

        var response = element(by.binding('response'));
        expect(response.getText()).toEqual("Feedback sent. Thank you!");
    });

    it('should output invalid response', function() {
        var inputFeedback = element(by.input('feedback')).sendKeys('Valid feedback!');
        var submitButton = ptor.findElement(protractor.By.id('submit'));
        submitButton.click();
        ptor.sleep(1000);

        submitButton.click();
        ptor.sleep(1000);
        submitButton.click();
        ptor.sleep(1000);

        var response = element(by.binding('response'));
        expect(response.getText()).toEqual("This has already been submitted!");
    });
});