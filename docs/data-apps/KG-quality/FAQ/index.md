# TriplyDB knowledgraph quality 
## FAQ

### Running assessments

**How long does an assessment take?**
It depends on the test and the size of your graph. SPARQL-based tests (T006–T010) are typically fast — minutes for most graphs. Embedding-based tests (T001–T005) take longer because they compare pairs of terms. LLM-based tests (T011–T012) are the slowest and most expensive, because they require one model call per subclass assertion or class definition. For very large graphs, LLM tests can take several hours.

**Can I run more than one test at a time?**
Each run of KG_Quality_App executes one test. To run multiple tests, start a separate run for each one.

**Can I run KG Quality against a graph that is not in TriplyDB?**
Yes. KG Quality works against any accessible SPARQL endpoint, regardless of where the graph is hosted. The only requirement is that the endpoint is reachable over HTTP(S) from your TriplyDB instance.

**The app ran but I don't see a report. What should I check?**
Check that the dataset you specified in the **Quality report dataset** field exists in the account you specified. The dataset must be created before you run the assessment — KG Quality does not create datasets automatically.

### Understanding results

**A test flagged a pair as a duplicate, but I think they are different concepts. What does that mean?**
The embedding-based tests (T001–T003) flag pairs whose labels are semantically similar above a threshold. A flag is a suggestion, not a definitive finding. Review each flagged pair and decide whether to merge, rename, or leave the terms as they are.

**T011 flagged a subclass relationship as invalid. Should I remove it?**
The LLM provides a verdict and an explanation for each flagged relationship. Read the explanation first. If the reasoning is sound for your domain, consider revising the relationship. If the reasoning does not apply to your context, you can disregard the finding.

**What does it mean when a test output says "TBD" for complexity?**
Some tests are still being characterized in terms of how their runtime scales with graph size. This will be updated in a future release.

### Scope and limitations

**Does KG Quality replace SHACL validation?**
No. SHACL and KG Quality are complementary. Use SHACL to enforce constraints you can state as formal rules. Use KG Quality to surface quality problems that are harder to express as rules — such as semantic similarity, definition quality, or subclass soundness.

**Can I schedule KG Quality to run automatically?**
This depends on your TriplyDB configuration. Contact your TriplyDB administrator or Triply support for information about scheduling Flows runs.

Continue to
- [Getting started](./getting-started/index.md)
- [Concepts](./concepts/index.md)
- [How to](./how-to/index.md)
- [Reference](./reference/index.md)
- [Overview](./index.md)
