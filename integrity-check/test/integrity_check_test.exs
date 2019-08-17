defmodule IntegrityCheckTest do
  use ExUnit.Case

  import ExUnit.CaptureIO

  test "returns :ok if a csv file content has correct number of columns" do
    content = "x,y,z"
    result = fn ->
      assert IntegrityCheck.report(content) == {:ok}
    end
    assert capture_io(result) == "Everything is ok :)\n"
  end
  test "returns :error about incorrect column number" do
    content = "x,y"
    result = fn ->
      assert IntegrityCheck.report(content) == {:error}
    end
    assert capture_io(result) == "Something is wrong :(\nRow: 1, invalid columns length: 2\n"
  end
  test "returns :error about incorrect column number in multiline file content" do
    content = "x,y,z\nx"
    result = fn ->
      assert IntegrityCheck.report(content) == {:error}
    end
    assert capture_io(result) == "Something is wrong :(\nRow: 2, invalid columns length: 1\n"
  end
  test "returns :ok if given a file content with multiple empty lines at the end" do
    content = "x,y,z\n\n"
    result = fn ->
      assert IntegrityCheck.report(content) == {:ok}
    end
    assert capture_io(result) == "Everything is ok :)\n"
  end
  test "returns :ok if given a file content with multiple empty lines in the middle" do
    content = "x,y,z\n\n\nz,y,x"
    result = fn ->
      assert IntegrityCheck.report(content) == {:ok}
    end
    assert capture_io(result) == "Everything is ok :)\n"
  end
end
