# Sql Insert Editor

So, you get an SQL file with many `INSERT` command lines for your test table from the production database, right? I know, I've done this many times too.

The only problem is that you don't have all the referenced rows scattered across many other tables in your test database. You'll never be able to manually replace all those `_id` column values. Why is SQL insert syntax so difficult to edit? Why do we have a list of columns and a different list with their values?

I know, it's so frustrating!

But wait. You're a developer! If the DBMS can interpret and execute these commands, how can you not be able to edit these lines?

Today is your lucky day, and this tool is all you need.

Simply pass the parameters to the constructor and call its public method. The parameters you need are:

- input: Your SQL file name, including the path.

- output: Choose another file name; if something goes wrong, you'll still have your original file intact.

- replace: A JSON-like object where key is the column name, and the value is the new value you want to use in place of the original column value in  the SQL file.
