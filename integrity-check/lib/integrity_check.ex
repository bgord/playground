defmodule IntegrityCheck do
  @correct_row_length 3
  def load_file do
    filename = Application.get_env(:integrity_check, :CSV_FILE_PATH)

    case File.read(filename) do
      {:ok, content} ->
        content

      {:error, :enoent} ->
        IO.puts("\nGiven file" <> filename <> " doesn't exist...")
        System.halt(1)

      {:error, reason} ->
        IO.puts("Error while trying to read a file: " <> reason)
        System.halt(1)
    end
  end

  def report(content) do
    invalid_rows =
      content
      |> String.split("\n")
      |> Enum.filter(fn row -> row != "" end)
      |> Enum.map(fn row ->
        row
        |> String.split(",")
        |> Enum.count()
      end)
      |> Enum.with_index()
      |> Enum.filter(fn {length, _index} -> length != @correct_row_length end)

    case Enum.count(invalid_rows) do
      0 ->
        IO.puts("Everything is ok :)")
        {:ok}

      _ ->
        IO.puts("Something is wrong :(")

        Enum.each(invalid_rows, fn {length, index} ->
          IO.puts("Row: #{index + 1}, invalid columns length: #{length}")
        end)

        {:error}
    end
  end

  def exit(result) do
    result
    |> case do
      {:ok} -> System.halt(0)
      {:error} -> System.halt(1)
    end
  end

  def init do
    IntegrityCheck.load_file()
    |> IntegrityCheck.report()
    |> IntegrityCheck.exit()
  end
end
